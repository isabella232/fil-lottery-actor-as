// @chainfile-index
import {caller, genericAbort} from "@zondax/fvm-as-sdk/assembly/wrappers"
import {State} from "./state"

// @ts-ignore
@constructor
// Function executed on create actor
function constructor(): void {
// @ts-ignore
  State.defaultState().save()

  return;
}

// @ts-ignore
@export_method(2)
// `register` the caller address as a participants
function register(): void {
  const address = caller()

  // @ts-ignore
  const state = State.load() as State
	state.participants.push(address)
	state.save()

  return
}

// @ts-ignore
@export_method(3)
// `winner` select the winner
function winner(): void {
	const state = State.load() as State

	//const winner = (Math.random() * state.participants.length) as u32
	const random = 0

	if (state.participants.length <= random) {
		genericAbort(17, `index is too big (participants ${state.participants})`)
	}

	const winner: u64 = state.participants[0]

	genericAbort(17, `The winner id ${winner}`)

  return
}
