// @chainfile-index
import { caller, genericAbort, valueReceived, send } from "@zondax/fvm-as-sdk/assembly/wrappers"
import { USR_UNHANDLED_MESSAGE } from "@zondax/fvm-as-sdk/assembly/env"
import { u128 } from "as-bignum/assembly"
import { State } from "./state"

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

  // 1 000 AttoFil to participate
  const amount = valueReceived()
  if (amount != u128.fromString("1000")) {
    // weird amount.toString() lead to error in wasm
    genericAbort(USR_UNHANDLED_MESSAGE, "To participate you must sent 1000")
  }

  // @ts-ignore
  const state = State.load() as State
  state.participants.push(address)
  state.save()

  return
}

function encodeUnsignedLeb128FromUInt64(value: u64): Array<u8> {
  const result: Array<u8> = []
  while (true) {
    const byte_ = value & 0x7f
    value >>= 7
    if (value === 0) {
      result.push(byte_ as u8)
      return result
    }
    result.push((byte_ | 0x80) as u8)
  }
}

// @ts-ignore
@export_method(3)
// `winner` select the winner
function winner(): void {
  const state = State.load() as State

  const random = 0
  const winner: u64 = state.participants[0]

  // send all the money to winner

  // convert to actorID to address payload
  const encodedActor = encodeUnsignedLeb128FromUInt64(winner)
  const recipient = new Uint8Array(encodedActor.length+1)
  const payload: Array<u8> = [0]
  payload.concat(encodedActor)
  recipient.set(payload)

  const params = new Uint8Array(0)
  const amount = u128.from("1000")

  const res = send(recipient, 0, params, amount.hi, amount.lo)

  if (res.exit_code != 0) {
    genericAbort(res.exit_code, "Fail to send reward to actor")
  }

  return
}
