import { OverlayModal } from '@affine/component';
import { openHistoryTipsModalAtom } from '@affine/core/atoms';
import { useEnableCloud } from '@affine/core/hooks/affine/use-enable-cloud';
import { useI18n } from '@affine/i18n';
import { useService, WorkspaceService } from '@toeverything/infra';
import { useAtom } from 'jotai';
import { useCallback } from 'react';

import TopSvg from './top-svg';

export const HistoryTipsModal = () => {
  const t = useI18n();
  const currentWorkspace = useService(WorkspaceService).workspace;
  const [open, setOpen] = useAtom(openHistoryTipsModalAtom);
  const confirmEnableCloud = useEnableCloud();

  const handleConfirm = useCallback(() => {
    setOpen(false);
    confirmEnableCloud(currentWorkspace);
  }, [confirmEnableCloud, currentWorkspace, setOpen]);

  return;
};
