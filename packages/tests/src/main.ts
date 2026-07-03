import { ScenarioRunner } from './ScenarioRunner'
import { CreateWorkspaceScenario } from './scenarios/CreateWorkspaceScenario'

async function main() {
    const runner = new ScenarioRunner()
    runner.register(new CreateWorkspaceScenario())
    await runner.run()
}
main()
