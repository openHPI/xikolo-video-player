import { FunctionalComponent, h } from '@stencil/core';
import { loading as loadingIcon } from '../../utils/icon';
import { Status } from '../../utils/status';

interface LoadingProps {
  status: Status;
}

export const Loading: FunctionalComponent<LoadingProps> = ({
  status: { loading, fullscreen },
}) => {
  return (
    loading && (
      <div class={fullscreen ? 'loading loading--fullscreen-mode' : 'loading'}>
        <span class="loading__spinner" innerHTML={loadingIcon} />
      </div>
    )
  );
};
