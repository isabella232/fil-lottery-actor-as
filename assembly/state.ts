// @chainfile-state
import { BaseState } from "@zondax/fvm-as-sdk/assembly/utils/state"

// @ts-ignore
@state
// @ts-ignore
export class State extends BaseState {
    participants: Array<u64>
}
