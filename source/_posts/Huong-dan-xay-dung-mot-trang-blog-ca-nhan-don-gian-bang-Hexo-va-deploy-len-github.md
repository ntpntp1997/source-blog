---
title: Hướng dẫn xây dựng một trang blog cá nhân đơn giản bằng Hexo và deploy lên github
date: 2020-04-24 13:21:02
description: 'Hexo được tạo ra bằng Node.js và với mục đích chính dùng cho trang blog. Giống với rất nhiều static site generators khác, bạn cũng sẽ soạn thảo nội dung với markdown. Template mặc định được Hexo sử dụng chính là Swig. Swig không còn xa lạ gì đối với một lập trình viên JS. Tuy nhiên bạn cũng có thể sử dụng một template engine khác nếu muốn, Hexo cho phép bạn làm được điều này. So với Jekyll hoặc Hugo thì Hexo có đôi chút phức tạp hơn.'
keywords: 'Blog, website static, website dynamic, Hugo, Jekyll, Hexo, Gatsby, github'
tags:
  - 'GitHub'
  - 'Hexo'
categories:
  - 'Framework'
  - 'Developer'
photos:
  ['https://fech.in/static/images/cover/convert-excel-to-markdown-table.jpeg']
banner: '/images/hexo.png'
thumbnail: '/images/hexo.png'
---

Chuyện tạo ra một trang blog bằng các opensource CMS như wordpress, ghost, joomla... bây giờ là quá dễ dàng, nhanh gọn. Nhưng nó cũng có một số khuyết điểm của nó: như cồng kềnh, hay nếu không được tối ưu tốt sẽ gây ra hậu quả nặng site vân vân và mây mây ...

Hầu hết các trang web trên mạng internet chúng ta truy cập mỗi ngày, chúng đều được tạo ra dynamic. Nghĩa là nội dung sẽ được lưu trữ trong database. Khi có người truy cập, server sẽ thực hiện quá trình load data và render HTML.

Cũng có rất nhiều trang web tạo ra static thay vì dynamic. Bởi vì những ưu điểm static website mang lại rất lớn cho các trang web với nhu cầu cơ bản như blog, trang giới thiệu công ty, hay một website cá nhân. Tuy nhiên static website cũng mang trong mình nhiều vấn đề bất cập. Cụ thể trong trường hợp chúng ta muốn đổi layout, đổi theme thì phải làm sao? Đối với một static website xây dựng bằng cách tự soạn HTML thủ công để làm được việc này rất tốn công. Chúng ta phải ngồi và update lại từng HTML một, giả dụ trang blog của bạn có 1000 bài viết bạn sẽ phải sửa 1000 tệp tin HTML. Nhưng bạn vẫn thích static website bởi vì lợi ích quá lớn, và như cầu của bạn cũng không cần nhiều. Bạn chỉ cần một blog đơn giản để thỏa mãn đam mê viết lách mỗi ngày mà thôi. Vậy thì static site generators chính là giải pháp tối ưu dành cho bạn.

Hôm nay mình sẽ hướng dẫn các bạn cách làm một trang blog cá nhân bằng Static website generator.
Bài viết này mình sẽ sử dụng Hexo và GitHub làm hướng dẫn và deploy.

## Hexo static website dành riêng cho viết blog

Hexo được tạo ra bằng Node.js và với mục đích chính dùng cho trang blog. Giống với rất nhiều static site generators khác, bạn cũng sẽ soạn thảo nội dung với markdown. Template mặc định được Hexo sử dụng chính là Swig. Swig không còn xa lạ gì đối với một lập trình viên JS. Tuy nhiên bạn cũng có thể sử dụng một template engine khác nếu muốn, Hexo cho phép bạn làm được điều này. So với Jekyll hoặc Hugo thì Hexo có đôi chút phức tạp hơn.

### Yêu cầu

- Nodejs 8 trở lên. Bạn có thể cài nodejs tại https://nodejs.org và tìm các phiên bản phù hợp. Mình đang dùng phiên bản Nodejs 12

## Cài đặt

```bash
$ npm install -g hexo-cli
```

### Tạo blog run local

Tạo một thư mục chứa blog của bạn, tại thư mục này chạy lệnh sau để khởi tạo một blog hexo:

```bash
$ hexo init <folder>
$ cd <folder>
$ npm install
```

Chạy blog ở local:

```bash
$ hexo server
```

Mở trình duyệt và truy cập địa chỉ http://localhost:4000 để xem kết quả!

### Viết bài và public

Phần liên quan nhất tới viết blog, viết ở đâu, ra sao? Hexo hỗ trợ viết bài với định dạng markdown. Khi tạo bài viết mới bằng lệnh:

```bash
$ hexo new "hello world"
```

Hexo sẽ sinh ra 1 file mang tên hello-world.md ở thư mục /source/\_post và thư mục chứa assest của post đó là /source/\_post/hello-world/.
Để có thể viết bài thì bạn chỉ cần mở file .md đó bằng bất cứ trình soạn thảo markdown nào cũng được hoặc là notepad++ =))
Bạn nên xem qua hướng dẫn trên trang chủ của hexo về format viết bài.
Bản chất thì hexo sẽ sinh ra file .html tĩnh tương ứng với bài viết .md của bạn.

### Hexo theme

Bất cứ Blog framework nào cũng sẽ hỗ trợ theme cho bạn lựa chọn. Hexo cũng vậy, có một tá theme ở đây. Hầu như các theme ở đấy đều miễn phí và mã nguồn mở trên github.

Cài đặt theme ra sao? Thư mục theme ở /thư mục gốc/themes. Trong thư mục này mỗi thư mục con là một theme. Vậy nên để cài đặt theme mới thì việc đầu tiên là bạn phải clone code theme đó vào thư mục themes của Hexo. Ví dụ mình sử dụng theme cactus thì thư mục sẽ như sau:

Cấu hình để Hexo nhận theme vừa tải về như sau: giả sử bạn vừa tải về theme cactus. Bây giờ mở file \_config.yml trong thư mục blog ra. Sử dòng cấu hình theme thành như sau:

```
# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
#theme: landscape
theme: cactus
```

Ok. Chạy lại hexo server để xem kết quả!
Lưu ý, một điều rất hay ở đây là hexo tách mỗi theme ra thành một project riêng, có package.json riêng, có \_config.yaml riêng vì thế rất rõ ràng và tiện lợi, nếu bạn cài đặt theme khác thì chú ý tài liệu của theme để cấu hình theme cho đúng nhé.

### Đăng ký Github Pages

Đăng ký Github Pages cực kỳ đơn giản, bạn đăng ký một tài khoản github vd: ntpntp1997. Thì blog của bạn sẽ có địa chỉ truy cập là http://ntpntp1997.github.io. Chi tiết xem hướng dẫn trên trang chủ Github Pages.

Sinh web tĩnh và deploy lên github pages
Giả sử bạn đã đăng ký được github page. Bây giờ ta sẽ tạo web tĩnh từ Hexo và deploy lên Github Pages.
Hexo cung cấp một file cấu hình \_config.yml ở thư mục gốc của blog. Tại thư mục này ta cấu hình để deploy như sau:

```
deploy:
    type: git
    repo: https://github.com/ntpntp1997/ntpntp1997.github.io.git
```

Ta chỉ ra rằng sẽ deploy bằng git và nơi sẽ deploy là repo https://github.com/ntpntp1997/ntpntp1997.github.io.git
Cài đặt thư viện hexo-deployer-git để có thể deploy:

```bash
$ npm install hexo-deployer-git -save
```

Cuối cùng thực hiện deploy bằng lệnh sau:

```bash
$ hexo deploy
```

Lúc này Hexo sẽ sinh web tĩnh ra và push lên repo của chúng ta đa đăng ký. Xong, bây giờ blog của chúng ta đã có trên github page và có thể truy cập được rồi.
Rất đơn giản phải không!

Nên nhớ bạn sẽ phải chạy lệnh generate lại sau mỗi khi thêm bài viết hay chỉnh sửa theme lại để hexo tạo ra các file web tĩnh mới và deploy lại, nó sẽ như thế này:

```bash
$ hexo generate // generate lại static web
$ hexo deploy
// hoặc ngắn gọn hơn là
$ hexo generate -d
```

Vậy là bài viết của mình đã xong rồi. Trong các bài viết sau mình sẽ hướng dẫn các bạn cách làm 1 theme website cho Hexo. Nếu mọi người có hứng thú với các framework static website generator khác mình sẽ làm bài viết về các framework đó cho các bạn :)))))

Trang blog này của mình cũng sử dụng hexo để làm. Cám ơn các bạn đã theo dõi bài viết của mình !!!
