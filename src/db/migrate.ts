import postgres from "postgres";
import chalk from 'chalk'
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const connection = postgres('postgresql://docker:docker@localhost:5432/pizza_shop', { max: 1 })
const db = drizzle(connection)

await migrate(db, { migrationsFolder: 'drizzle'})

console.log(chalk.greenBright('Migrations applied successfully!'))

await connection.end()

process.exit()