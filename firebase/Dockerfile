# Currently using token from blueprint project at ryannguyen@uwblueprint.org --> RELIES on this project still being active this to work. 
# TODO: migrate to uwblueprint official database/project 
# TODO: move away from authentication token to GOOGLE_APPLICATION_CREDENTIALS: https://cloud.google.com/docs/authentication/provide-credentials-adc 

FROM node:20.11.1-slim

# OPTIONAL
# Copy firebase cache to avoid downloading upon running image. Requires ./firebase/emulators/ folder containing the .jar files 
RUN mkdir -p /root/.cache/firebase
COPY ./firebase/ /root/.cache/firebase/

WORKDIR /app

# Install java 
RUN apt-get update && \
    apt-get install -y default-jdk && \
    apt-get clean

# Install firebase-tools cli 
RUN npm install -g firebase-tools


# TODO: copy everything except firebase folder to avoid duplicate COPY (already copying into /root/.cache)
COPY . .

# Auth emulator: 9099
# Firestore emulator: 5002
# Emulator UI: 5003
# storage emulator: 9199
# Internal ports, hub:4400. logging:4500
EXPOSE 9099 5002 5003 9199 4400 4500

# Run firebase emulator services
ENTRYPOINT ["firebase", "emulators:start", "--token=$FIREBASE_TOKEN"]
# CMD ["tail", "-f", "/dev/null"]

# HEALTHCHECK CMD curl --fail http://localhost:5003 || exit 1