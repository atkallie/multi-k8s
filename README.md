# Architecture

```mermaid
graph LR;
    Browser[Web Browser] --> Nginx((NGINX));
    Nginx --> React(React Server);
    Nginx --> API(Express Server);
    React --> API;
    API --> Database[(PostgreSQL Database)];
    API --> Redis[Redis In-Memory Data Store];
    Redis --> Worker[Worker]
    Worker --> Redis
```
