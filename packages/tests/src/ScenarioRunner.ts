import { Scenario } from './Scenario'

export class ScenarioRunner {
    private readonly scenarios: Scenario[] = []

    public register(scenario: Scenario): void {
        this.scenarios.push(scenario)
    }

    public async run(): Promise<void> {
        console.log(`
            ===========================
            Novakshar Integration Tests
            ===========================
        `)

        for(const scenario of this.scenarios) {
            console.log(`Running scenario: ${scenario.name}`)
            try {
                const started = performance.now()
                await scenario.run()
                const elapsed = performance.now() - started
                console.log(`Scenario ${scenario.name} completed in ${elapsed.toFixed(2)} ms.`)
            } catch(error) {
                console.error(`Scenario ${scenario.name} failed with error:`, error)
                break
            }
            console.log('')
        }
    }
}
