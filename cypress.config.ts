import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: "e2e/cypress/**/*.cy.ts",
    supportFile: false
  },
})