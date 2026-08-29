# WordPress/WooCommerce 后台迁移步骤

这个项目是 Next.js 前端，部署在 Vercel；产品和商店数据来自一个独立的 WordPress + WooCommerce 后台。

旧后台地址现在写成了备用值：`http://45.145.229.20:2031`。新后台建好后，只需要在 Vercel 里设置 `WORDPRESS_URL`，前端就会改读你的新后台。

## 1. 准备新的 WordPress 主机

WordPress 不能直接部署在 Vercel 上，因为它需要 PHP 和 MySQL/MariaDB。推荐用独立 WordPress 主机或 VPS。

最低建议：

- PHP 8.3 或更高
- MySQL 8.0 或 MariaDB 10.11+
- HTTPS/SSL
- 能安装插件和上传媒体文件

建议域名：

- 前端：`https://adesmarthome.com.au` 或你现在的主域名
- 新后台：`https://wp.adesmarthome.com.au`

## 2. 安装 WordPress

在主机控制台里新建 WordPress 站点：

- Site title: `ADE Smart Home`
- Admin username: 不要用 `admin`
- Admin email: 用你自己的邮箱
- 开启 HTTPS

后台登录地址一般是：

```text
https://wp.adesmarthome.com.au/wp-admin
```

## 3. 安装 WooCommerce

进入 WordPress 后台：

1. 打开 `Plugins -> Add New Plugin`
2. 搜索并安装 `WooCommerce`
3. 激活 WooCommerce
4. Store country 选择 Australia
5. Currency 选择 AUD
6. 先跳过支付配置也可以，因为当前前端主要是展示产品和引导预约安装

## 4. 设置固定链接

进入：

```text
Settings -> Permalinks
```

选择：

```text
Post name
```

保存。保存后测试这两个接口：

```text
https://wp.adesmarthome.com.au/wp-json/wc/store/v1/products
https://wp.adesmarthome.com.au/?rest_route=/wc/store/v1/products
```

任意一个返回 JSON 产品列表即可。当前代码使用第二种 `rest_route` 兼容形式。

## 5. 创建产品分类

WooCommerce 后台进入：

```text
Products -> Categories
```

至少创建这些分类，名称要和前端筛选保持一致：

```text
SMART LOCK
```

## 6. 创建产品

进入：

```text
Products -> Add New
```

每个产品建议填写：

- Product name：产品名
- Regular price：原价
- Sale price：促销价，可选
- Product short description：产品页右侧简短介绍
- Product description：详细介绍/规格
- Product image：主图
- Product gallery：更多图片
- Categories：选择 `SMART LOCK`
- Attributes：用于产品页 Technical Specs

发布后测试：

```text
https://wp.adesmarthome.com.au/?rest_route=/wc/store/v1/products&per_page=20
```

## 7. 设置 Vercel 环境变量

进入 Vercel 项目：

```text
Settings -> Environment Variables
```

添加：

```text
WORDPRESS_URL=https://wp.adesmarthome.com.au
```

环境选择：

```text
Production
Preview
Development
```

保存后重新部署 Vercel 项目。部署完成后访问：

```text
/products
```

如果产品出现，迁移成功。

## 8. 常见问题

如果 `/products` 为空：

- 检查产品是否已 Published
- 检查 WooCommerce 是否启用
- 检查分类名是否完全匹配，例如 `SMART LOCK`
- 打开产品接口看是否返回 JSON

如果图片不显示：

- 确认 Vercel 的 `WORDPRESS_URL` 是新后台地址
- 确认新后台图片是 HTTPS
- 改完环境变量后必须重新部署

如果后台打不开：

- 检查主机 PHP/MySQL 服务
- 检查域名 DNS 是否指向新主机
- 检查 SSL 是否签发成功
