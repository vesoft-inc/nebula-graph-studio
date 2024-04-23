# NebulaGraph Studio

<div align=center>
  <img src="./readmeLogo.png" />
</div>

NebulaGraph Studio (Studio for short) is a web-based visualization tool for NebulaGraph. With Studio, you can create a graph schema, import data and edit nGQL statements for data queries.
![](./introduction.png)

## Architecture
![](architecture.png)

## Version
| NebulaGraph version | NebulaGraph Studio tag | 
|----------------------|---------------------------|
| 1.x                  | v1.2.7                    |
| 2.0.x                | v2.2.x                    |
| 2.5.x                | v3.0.x                    |
| 2.6.x                | v3.1.x                    |
| 3.0.x                | v3.2.x                    |
| 3.1.x                | v3.3.x                    |
| 3.0.0 ～ 3.2.0       | v3.4.x                    |
| 3.0.0 ～ 3.3.0       | v3.5.x                    |
| 3.0.0 ～ 3.4.0       | v3.6.x                    |
| 3.0.0 ～ 3.5.0       | v3.7.x                    |
| 3.0.0 ～ 3.6.0       | v3.8.x                    |
| 3.0.0 ～ latest      | v3.9.x                    |

## Development Quick Start

### set up studio and server at the same time
```
$ npm install
$ npm run dev
$ npm run dev:go
```

### Set up nebula-graph-studio only
```
$ npm install
$ npm run dev
```
### Set up go-server only
```
$ cd ./server/api/studio
$ make run
```

## Production Deploy

### 1. Build Web
```
$ npm install
$ npm run build
$ mv dist/* server/api/studio/assets
```

### 2. Build Server
```
$ cd server/api/studio
// update default port 9000 to 7001 in etc/studio-api.yaml first
$ go build -o server
```

### 3. Start
```
$ ./server &
```

### 4. Stop Server
Use when you want shutdown the web app
```
kill -9 $(lsof -t -i :7001)
```

## Documentation 3.9.2
[中文](https://docs.nebula-graph.com.cn/3.6.0/nebula-studio/about-studio/st-ug-what-is-graph-studio/)
[ENGLISH](https://docs.nebula-graph.io/3.6.0/nebula-studio/about-studio/st-ug-what-is-graph-studio/)

## Contributing
Contributions are warmly welcomed and greatly appreciated. Please see [Guide Docs](https://github.com/vesoft-inc/nebula-studio/blob/master/CONTRIBUTING.md) 
