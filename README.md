# Lancer sur QA (défaut)
npx playwright test

# Lancer sur PPR
TEST_ENV=ppr npx playwright test

# Lancer sur UAT
TEST_ENV=uat npx playwright test

# Tous les portails sur QA
npm run test:qa

# Un portail spécifique
npx playwright test --project=R3S

# Un portail + une feature
npx playwright test --project=R3S login.spec.ts

# Tous les portails sur PPR
npm run test:ppr