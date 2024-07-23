import { notify, useConfirmModal } from '@affine/component';
import { authAtom } from '@affine/core/atoms';
import { AuthService } from '@affine/core/modules/cloud';
import { WorkspaceSubPath } from '@affine/core/shared';
import { useI18n } from '@affine/i18n';
import type { Workspace } from '@toeverything/infra';
import {
  useLiveData,
  useService,
  WorkspacesService,
} from '@toeverything/infra';
import { useSetAtom } from 'jotai';
import { useCallback } from 'react';

import { useNavigateHelper } from '../use-navigate-helper';

interface ConfirmEnableCloudOptions {
  /**
   * Fired when the workspace is successfully enabled
   */
  onSuccess?: () => void;
  /**
   * Fired when workspace is successfully enabled or user cancels the operation
   */
  onFinished?: () => void;
  openPageId?: string;
}
type ConfirmEnableArgs = [Workspace, ConfirmEnableCloudOptions | undefined];

export const useEnableCloud = () => {
  const t = useI18n();
  const loginStatus = useLiveData(useService(AuthService).session.status$);
  const setAuthAtom = useSetAtom(authAtom);
  const { openConfirmModal, closeConfirmModal } = useConfirmModal();
  const workspacesService = useService(WorkspacesService);
  const { openPage } = useNavigateHelper();

  const enableCloud = useCallback(
    async (ws: Workspace | null, options?: ConfirmEnableCloudOptions) => {
      try {
        if (!ws) return;
        const { id: newId } = await workspacesService.transformLocalToCloud(ws);
        openPage(newId, options?.openPageId || WorkspaceSubPath.ALL);
        options?.onSuccess?.();
      } catch (e) {
        console.error(e);
        notify.error({
          title: t['com.affine.workspace.enable-cloud.failed'](),
        });
      }
    },
    [openPage, t, workspacesService]
  );

  const openSignIn = useCallback(() => {
    setAuthAtom(prev => ({ ...prev, openModal: true }));
  }, [setAuthAtom]);

  const signInOrEnableCloud = useCallback(
    async (...args: ConfirmEnableArgs) => {
      // not logged in, open login modal
      if (loginStatus === 'unauthenticated') {
        openSignIn();
      }

      if (loginStatus === 'authenticated') {
        await enableCloud(...args);
      }
    },
    [enableCloud, loginStatus, openSignIn]
  );

  const confirmEnableCloud = useCallback(
    (ws: Workspace, options?: ConfirmEnableCloudOptions) => {
    },
    [closeConfirmModal, loginStatus, openConfirmModal, signInOrEnableCloud, t]
  );

  return confirmEnableCloud;
};
