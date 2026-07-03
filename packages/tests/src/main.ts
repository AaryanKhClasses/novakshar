import { ScenarioRunner } from './ScenarioRunner'
import { CreateWorkspaceScenario, FolderLifecycleScenario, OpenWorkspaceScenario } from './scenarios'

async function main() {
    const runner = new ScenarioRunner()
    runner.register(new CreateWorkspaceScenario())
    runner.register(new OpenWorkspaceScenario())
    runner.register(new FolderLifecycleScenario())
    await runner.run()
}
main()
