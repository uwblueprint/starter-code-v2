import { program } from 'commander';
import FirebaseRestClient from './backend/typescript/utilities/firebaseRestClient';
import logger from "./backend/typescript/utilities/logger";

const Logger = logger(__filename);

async function generateToken(email: string, password: string) {
    try {
        const token = await FirebaseRestClient.signInWithPassword(email, password);
        return { ...token };
    } catch (error) {
        Logger.error(`Failed to generate token for user with email ${email}`);
        throw error;
    }
}

program
  .description('CLI to generate user token for Firebase');

program
    .command('generate-token')
    .description('Generate token for user given username and password')
    .argument('<email>', 'Enter email')
    .argument('<password>', 'Enter password')
    .action(async (email, password) => {
        try {
            const token = await generateToken(email, password);
            process.stdout.write(JSON.stringify(token) + '\n');
        } catch (error) {
            process.stdout.write('Error generating token.\n');
        }
    });

program.parse(process.argv);