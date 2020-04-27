'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function(resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const FileAsync_1 = __importDefault(require('lowdb/adapters/FileAsync'));
const camelcase_1 = __importDefault(require('camelcase'));
const lowdb_1 = __importDefault(require('lowdb'));
const { FB, FacebookApiException } = require('fb');
const adapter = new FileAsync_1.default('facebook-db.json');
function validateConfig() {
  return !(
    hexo.config.facebookAutoPublish &&
    hexo.config.facebookAutoPublish.pageId &&
    hexo.config.facebookAutoPublish.accessTokenKey
  );
}
function appSetup(config, body) {
  return new Promise((resolve, reject) => {
    FB.setAccessToken(config.access_token_key);
    FB.api(`${config.page_id}/feed`, 'post', body, function(res) {
      if (!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return reject(!res ? 'error occurred' : res.error);
      }
      console.log('Post Id: ' + res.id);
      return resolve(res);
    });
  });
}
function facebookConfig() {
  if (validateConfig()) {
    throw new Error('Missing hexo-facebook-auto-publish configuration');
  }
  return {
    page_id: hexo.config.facebookAutoPublish.pageId,
    access_token_key: hexo.config.facebookAutoPublish.accessTokenKey,
  };
}
function setupFacebook(db) {
  return __awaiter(this, void 0, void 0, function*() {
    yield db
      .defaults({ published: [], 'to-destroy': [], 'to-publish': [] })
      .write();
    return {
      updateDB({ title, permalink, description, tags }, hexoPublished) {
        return __awaiter(this, void 0, void 0, function*() {
          yield db.read();
          const published = db
            .get('published')
            .find({ permalink })
            .value();
          if (published) {
            if (!hexoPublished) {
              yield db
                .get('to-destroy')
                .push(published)
                .write();
              yield db
                .get('to-publish')
                .remove({ permalink })
                .write();
            }
          } else {
            if (hexoPublished) {
              const tagNames = tags ? tags.map((tag) => tag.name || tag) : [];
              const data = {
                title,
                permalink,
                description,
                hexoPublished,
                tags: tagNames,
              };
              const document = db.get('to-publish').find({ permalink });
              if (document.value()) {
                yield document.assign(data).write();
              } else {
                yield db
                  .get('to-publish')
                  .push(data)
                  .write();
              }
            } else {
              yield db
                .get('to-publish')
                .remove({ permalink })
                .write();
            }
          }
        });
      },
      publish() {
        return __awaiter(this, void 0, void 0, function*() {
          yield db.read();
          const toDestroy = db.get('to-destroy').value();
          const toPublish = db.get('to-publish').value();
          try {
            // const client = new Facebook(facebookConfig());
            // await Promise.all(
            //   toDestroy.map(async (documentInfo: DocumentInfo) => {
            //     const { facepostId } = documentInfo;
            //     try {
            //       await client.post(`statuses/destroy/${facepostId}`, {});
            //       await db
            //         .get('published')
            //         .remove({ facepostId })
            //         .write();
            //       await db
            //         .get('to-destroy')
            //         .remove({ facepostId })
            //         .write();
            //     } catch (error) {
            //       throw new Error(`id: ${facepostId}\n${JSON.stringify(error)}`);
            //     }
            //   })
            // );
            yield Promise.all(
              toPublish.map((documentInfo) =>
                __awaiter(this, void 0, void 0, function*() {
                  const { title, tags, description, permalink } = documentInfo;
                  const hashedTags = tags
                    .map((tag) => `#${camelcase_1.default(tag)}`)
                    .join(' ');
                  const status = `${title}
                            ${description} 
                            ${hashedTags} 
                            link: ${permalink}`;
                  let body = {
                    message: status,
                    link: permalink,
                  };
                  try {
                    const facepost = yield appSetup(facebookConfig(), body);
                    yield db
                      .get('published')
                      .push(
                        Object.assign(Object.assign({}, documentInfo), {
                          facepostId: facepost.id,
                        })
                      )
                      .write();
                    yield db
                      .get('to-publish')
                      .remove({ permalink })
                      .write();
                  } catch (error) {
                    throw new Error(`${status}\n${JSON.stringify(error)}`);
                  }
                })
              )
            );
          } catch (error) {
            hexo.log.error(error);
          }
        });
      },
      cleanToPublish() {
        return __awaiter(this, void 0, void 0, function*() {
          yield db
            .get('to-publish')
            .remove()
            .write();
        });
      },
    };
  });
}
function processDocument(updateDB) {
  return (document) =>
    __awaiter(this, void 0, void 0, function*() {
      const publishedPost = document.layout === 'post' && document.published;
      const publishedPage =
        document.layout !== 'post' && document.facebookAutoPublish !== false;
      const hexoPublished = publishedPost || publishedPage;
      yield updateDB(document, hexoPublished);
      return document;
    });
}
function registerFilters(cleanToPublish, updateDB) {
  return __awaiter(this, void 0, void 0, function*() {
    const updateDocumentDB = processDocument(updateDB);
    hexo.extend.filter.register('after_post_render', updateDocumentDB, {
      async: true,
    });
    hexo.extend.filter.register(
      'after_generate',
      () =>
        __awaiter(this, void 0, void 0, function*() {
          yield cleanToPublish();
          const posts = hexo.locals.get('posts');
          for (var index = 0; index < posts.length; index++) {
            const post = posts.data[index];
            yield updateDocumentDB(post);
          }
        }),
      { async: true }
    );
  });
}
function watchHexoDeployAfter(facebookPublish) {
  hexo.on('deployAfter', function() {
    facebookPublish();
  });
}
function registerConsoleCommandPublish() {
  hexo.extend.console.register(
    'facebook-publish',
    'Facebook publish posts.',
    () =>
      __awaiter(this, void 0, void 0, function*() {
        const db = yield lowdb_1.default(adapter);
        const facebook = yield setupFacebook(db);
        facebook.publish();
      })
  );
}
registerConsoleCommandPublish();
function start() {
  return __awaiter(this, void 0, void 0, function*() {
    const db = yield lowdb_1.default(adapter);
    const facebook = yield setupFacebook(db);
    registerFilters(facebook.cleanToPublish, facebook.updateDB);
    watchHexoDeployAfter(facebook.publish);
  });
}
start();
