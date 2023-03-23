import { getCVATStore } from '@/store';
import { CombinedState } from '@/reducers';

export default function isAbleToChangeFrame(): boolean {
    const store = getCVATStore();

    const state: CombinedState = store.getState();
    // const { instance } = state.annotation.canvas;

    // return !!instance && instance.isAbleToChangeFrame() &&
        // !state.annotation.player.navigationBlocked;
        return false
}
