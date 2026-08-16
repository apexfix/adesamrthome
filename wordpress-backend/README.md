# VPS Docker 部署 WordPress 后台

如果你选择自己租 VPS，可以用这里的 Docker Compose 启动 WordPress + MySQL。

## 1. 服务器要求

- Ubuntu 22.04/24.04
- Docker 和 Docker Compose
- 至少 2GB RAM，WooCommerce 更建议 4GB+
- 一个后台域名，例如 `wp.adesmarthome.com.au`

## 2. 上传文件

把 `wordpress-backend` 文件夹上传到服务器，例如：

```bash
/opt/adesmarthome-wordpress
```

## 3. 创建环境变量

```bash
cp .env.example .env
nano .env
```

把两个密码改成强密码。

## 4. 启动 WordPress

```bash
docker compose up -d
```

启动后临时访问：

```text
http://SERVER_IP:8080
```

## 5. 绑定域名和 HTTPS

推荐用 Cloudflare、Nginx Proxy Manager、Caddy 或主机商面板，把：

```text
https://wp.adesmarthome.com.au
```

反向代理到：

```text
http://127.0.0.1:8080
```

完成后进入：

```text
https://wp.adesmarthome.com.au/wp-admin
```

继续安装 WooCommerce。

