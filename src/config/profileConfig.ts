import type { ProfileConfig } from "../types/profileConfig";

export const profileConfig: ProfileConfig = {
	// 头像
	// 图片路径支持三种格式：
	// 1. public 目录（以 "/" 开头，不优化）："/assets/images/avatar.webp"
	// 2. src 目录（不以 "/" 开头，自动优化但会增加构建时间，推荐）："assets/images/avatar.webp"
	// 3. 远程 URL："https://example.com/avatar.jpg"
	avatar: "assets/images/mugeng.avif",

	// 名字
	name: "arrangelimit",

	// 个人签名
	bio: "Hello, I'm arrangelimit.",

	// 链接配置
	// 已经预装的图标集：fa7-brands，fa7-regular，fa7-solid，material-symbols，simple-icons
	// 访问https://icones.js.org/ 获取图标代码，
	// 如果想使用尚未包含相应的图标集，则需要安装它
	// `pnpm add @iconify-json/<icon-set-name>`
	// showName: true 时显示图标和名称，false 时只显示图标
	links: [
		{
			name: "qq",
			icon: "fa7-brands:qq",
			url: "https://im.qq.com/index/#/G",
			showName: false,
		},
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/lhx3344",
			showName: false,
		},
		{
			name: "Email",
			icon: "fa7-solid:envelope",
			// 邮箱地址：改成你自己的 QQ 邮箱，例如 "mailto:123456789@qq.com"
			url: "mailto:1354706962@qq.com",
			showName: false,
			// 点击后弹窗显示邮箱并支持复制，而不是跳转到 mailto 地址
			popup: true,
		},
		{
			name: "RSS",
			icon: "fa7-solid:rss",
			url: "/rss/",
			showName: false,
		},
	],
};
