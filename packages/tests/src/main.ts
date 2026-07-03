import { ScenarioRunner } from './ScenarioRunner'
import { CreateWorkspaceScenario, FolderLifecycleScenario, OpenWorkspaceScenario, DocumentLifecycleScenario, PersistenceScenario, EventScenario, ScaleScenario } from './scenarios'

async function main() {
    const runner = new ScenarioRunner()
    runner.register(new CreateWorkspaceScenario())
    runner.register(new OpenWorkspaceScenario())
    runner.register(new FolderLifecycleScenario())
    runner.register(new DocumentLifecycleScenario())
    runner.register(new PersistenceScenario())
    runner.register(new EventScenario())
    runner.register(new ScaleScenario())
    await runner.run()
}
main()
