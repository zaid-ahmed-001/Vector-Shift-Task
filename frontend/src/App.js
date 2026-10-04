import { PipelineToolbar } from './components/pipeline/toolbar';
import { PipelineUI } from './components/pipeline/ui';
import { SubmitButton } from './components/pipeline/submit';

function App() {
  return (
    <div>
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
    </div>
  );
}

export default App;
