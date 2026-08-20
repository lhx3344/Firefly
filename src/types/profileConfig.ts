export type ProfileConfig = {
	avatar?: string;
	name: string;
	bio?: string;
	links: {
		name: string;
		url: string;
		icon: string;
		showName?: boolean;
		/** 设为 true 时，点击后弹窗显示邮箱（带复制），而不是跳转到 mailto 地址 */
		popup?: boolean;
	}[];
};
