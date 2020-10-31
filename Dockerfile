FROM openjdk:13
COPY ./ao-game-server.jar /usr/src/myapp/
WORKDIR /usr/src/myapp
EXPOSE 8080
EXPOSE 1337
EXPOSE 1338
ENTRYPOINT ["java", "-jar", "ao-game-server.jar"]
CMD ["-w"]
