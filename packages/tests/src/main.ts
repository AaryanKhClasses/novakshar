import { ScenarioRunner } from './ScenarioRunner'
import { CreateWorkspaceScenario, FolderLifecycleScenario, OpenWorkspaceScenario, DocumentLifecycleScenario } from './scenarios'

async function main() {
    const runner = new ScenarioRunner()
    runner.register(new CreateWorkspaceScenario())
    runner.register(new OpenWorkspaceScenario())
    runner.register(new FolderLifecycleScenario())
    runner.register(new DocumentLifecycleScenario())
    await runner.run()
}
main()
