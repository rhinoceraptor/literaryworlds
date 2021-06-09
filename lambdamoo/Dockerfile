FROM alpine:3.13.5 AS alpine

# Fetch LambdaMOO source and build it
FROM alpine as lambdamoo_build
RUN apk add git
RUN git clone https://github.com/rhinoceraptor/lambdamoo.git

WORKDIR lambdamoo
RUN apk add bison alpine-sdk
RUN sh configure
RUN make
RUN chmod +x moo

# Copy the LambdaMOO binary into a fresh alpine image
FROM alpine
WORKDIR lambdamoo
COPY --from=lambdamoo_build lambdamoo/moo .
ENTRYPOINT ['./moo']
