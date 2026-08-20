---
title: 学习尝试
published: 2026-08-19
tags: [Markdown, 博客, 演示]
category: 文章示例
draft: false
slug: draft
image: ./images/firefly1.avif
---

学习大标题
===========
学习小标题
-----------

# This is an H1
## This is an H2
###### This is an H6

>This is a blockquote

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
id sem consectetuer libero luctus adipiscing.

> This is the first level of quoting
>
>> This is nested blockquote.
>
> Back to the first level

> ## This is a header
>
> 1. This is the first list item
> 2. This is the second list item
>
> Here's some example code:
>
>      return shell_exec("echo $input | $markdown_script");

* Red
* Green
* Blue

+ Red
+ Green

列表会自动修正代码层的错误序号
1. bird
2. mchale
5. parish

反斜杠转义句点
1986\. What a great season.

列表中的缩进内容  
在列表项内放置引用，需要将 > 符号整体缩进
*   A list item with a blockquote.

    > This is a blockquote
    > inside a list item.

列表里的代码块
在列表项内放置代码块，需要缩进两层，8个空格或两个Tab:
*   A list item with a code block

        <code goes here>

* A
  * A1
  * A2
* B
* C

This is a normal paragraph:

    This is a code block.

    <div class="footer">
        &copy; 2004 Foo Corporation
    </div>

围栏代码块  
使用成对的反引号(```)围起来，就不需要四空格锁进了

Here's an example:

```

function test() {
    console.log("notice the blank line before this function ?")
}

```

语法高亮
在围栏代码块后添加可选的语言标识，即可启用语法高亮(ruby)

```ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
```

分割线（水平线）
HTML：<hr />一行中放置桑格或三个以上的短横线(-)、星号(*)或下划线(_)。符号之间允许有空格

* * *
***
*****
- - -
---------------------------------------
---

表格
用竖线(|)分隔列，用短横线(-)分隔表头，使用冒号(:)指定对齐方式

两侧的竖线(|)与对齐可选。用于表头分隔时，每列至少需要3个短横线。

这是一个markdown的使用学习测试，你也可以尝试一下

| Left | Center | Right |
|:-----|:------:|------:|
| 勺子  |无独有偶|逆天  |
|ddd   |eee     |fff    |   

A | B
---|---
123|456

A | B
-- | --
12 | 45

内联元素
链接
Markdown支持两种链接样式：行内链接与引用式链接

行内链接
行内链接格式:[文本](URL "标题")
标题可选

This is [an example](https://www.bilibili.com/) inlie link.  
[This link](https://www.bilibili.com/) has no title attribute.

See my [About](/about/) page for details.

引用式链接
可以预定义链接引用。定义格式：[id]: URL "标题"
标题同样可选。引用时使用：[文本][id]

[id]: https://www.bilibili.com/ "B站首页"
This is [an example][id] reference-style link.

说明
* 方括号中包含链接标识（不区分大小写，可在左侧缩进最多三个空格）
* 随后是冒号
* 再跟一个或多个空格
* 然后是连接URL
* URL可选地用尖括号包裹
* 可选地跟随标题属性，用引号或圆括号包裹

以上三中定义等价:  
[foo]: http://example.com/ "Option Title Here"  
[foo]: http://example.com/ 'Option Title Here'  
[foo]: http://examole.com/ (Option Title Here)  
[foo]: <http://example.com/> "Option Title Here"  

[Google]: http://google.com/
[Google][]

强调  
Markdown使用 **星号(\*)** 或 **下划线(\_)** 表示强调。**一个分隔符** `对应<em>`; **两个分隔符** `对应<strong>`.

*single asterisks*  
_single underscores_  
**double asterisks**  
__double underscores__

但如过两侧有空格，则会被视作普通字符而非强调语法
你可以使用反斜杠进行转义  
\*this text is surrounded by literal asterisks\*

行内代码  
用反引号(`)包裹

Use the `printf()` function.

若行内代码中需要包含反引号字符，可使用多重反引号作为定界符

``There is a literal backtick (`) here.``

行内代码两侧的定界符允许包含空格(开头一个、结尾一个)，方便再代码起始或结尾放置反引号字符

A single backtick in a code span:`` ` ``

A backtick-delimited string in a code span:`` `foo` ``

行内图片  
行内图片语法: `![替代文字](URL "标题")`

![Alt text](/src/assets/images/MobileWallpaper/m1.avif)
![Alt text](/src/assets/images/MobileWallpaper/m1.avif "尝试一下")

引用式图片  
引用式图片语法:`![替代文本][id]`

[img id]: https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp "Optional title attribute"
![初音未来][img id]

[img id]: https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp  "Optional title attribute"
![Alt text][img id]

删除线  
GFM增加了删除线语法  
~~Mistaken text.~~

自动链接

Markdown支持一种便携写法来创建"自动链接"(URL 与 邮箱地址) ：只需用尖括号将其包住即可

<http://example.com/>

<address@example.com>

GFM会自动识别标准URL并转换为链接

https://github.com/emn178/markdown

这不是第一行  
的第一个结尾

这是第二行