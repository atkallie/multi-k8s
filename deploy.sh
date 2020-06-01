#!/bin/bash

# build all of the production images
docker build -t kal17da/multicontainer-api:latest -t kal17da/multicontainer-api:$GIT_SHA ./api/
docker build -t kal17da/multicontainer-client:latest -t kal17da/multicontainer-client:$GIT_SHA ./client/
docker build -t kal17da/multicontainer-worker:latest -t kal17da/multicontainer-worker:$GIT_SHA ./worker/


# push the production images to Docker Hub
docker push kal17da/multicontainer-api:latest
docker push kal17da/multicontainer-client:latest
docker push kal17da/multicontainer-worker:latest

docker push kal17da/multicontainer-api:$GIT_SHA
docker push kal17da/multicontainer-client:$GIT_SHA
docker push kal17da/multicontainer-worker:$GIT_SHA

# apply all k8s configuration files (available in k8s directory)
kubectl apply -f k8s

# imperatively set version of image being used to update pods managed by deployment
kubectl set image deployments/api-deployment api=kal17da/multicontainer-api:$GIT_SHA
kubectl set image deployments/client-deployment client=kal17da/multicontainer-client:$GIT_SHA
kubectl set image deployments/worker-deployment worker=kal17da/multicontainer-worker:$GIT_SHA
