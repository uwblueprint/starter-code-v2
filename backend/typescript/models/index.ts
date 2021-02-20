import mongoose from "mongoose";
import { Sequelize } from "sequelize-typescript";

export const sequelize = new Sequelize(
    `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.POSTGRES_DB}`,
    { models: [__dirname + "/*.pgmodel.ts"] }
);

export const mongo = {
    connect: () => {
        mongoose.connect(
            encodeURI(process.env.MG_DATABASE_URL!),
            { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false },
            (error) => {
                if (error) {
                    /* tslint:disable-next-line no-console */
                    console.error("Error connecting to MongoDB: " + error.message);
                } else {
                    /* tslint:disable-next-line no-console */
                    console.info("Successfully connected to MongoDB!");
                }
            }
        );
    }
};
