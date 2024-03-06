/**
 * This will largely mirror ./transformingServerResponses.ts
 * The goal is to see if I can accomplish the same thing type-wise using JSDoc
 * types.
 */

/**
 * @typedef {Object} BizObj
 * @property {boolean} active
 * @property {string} created_at
 * @property {boolean} isPublic
 * @property {string} name
 * @property {string} type
 * @property {string} [archived_at]
 * @property {string} [last_active]
 */

// const doThing = (/** @type {BizObj} */ bo) => {
//   console.log(bo)
// }

/**
 * @typedef {Object} ServResp
 * @property {BizObj[]} data
 */

/** @type {ServResp} */
const servRes = {
  data: [
    {
      active: true,
      created_at: 'today',
      isPublic: true,
      name: 'New Hat',
      type: 'latestAndGreatest',
    },
    {
      active: false,
      created_at: 'yesterday',
      isPublic: false,
      name: 'Old Hat',
      type: 'soFetch',
      last_active: 'yesterday',
    },
    {
      active: false,
      created_at: 'idk',
      isPublic: false,
      name: 'Emo Hat',
      type: 'forBlackParade',
      archived_at: '2014',
    },
  ]
}

// Approach 1
const addStatus2V1 = (/** @type {BizObj} */ obj) => {
  let status = 'default case';
  if (obj.active) { status = 'active' }
  if (obj.archived_at) { status = 'dinosaur' }
  if (obj.last_active) { status = 'inactive' }

  return {
    ...obj,
    status,
  }
}

// Approach 2
/**
 * @typedef {Object} addStatus2Args
 * @property {BizObj['active']} active
 * @property {BizObj['archived_at']} [archived_at]
 * @property {BizObj['last_active']} last_active
 */

const addStatus2V2 = (/** @type {addStatus2Args} */ obj) => {
  let status = 'default case';
  if (obj.active) { status = 'active' }
  if (obj.archived_at) { status = 'dinosaur' }
  if (obj.last_active) { status = 'inactive' }

  return {
    ...obj,
    status,
  }
}

// Checking func in context
const dataWithStatus = servRes.data.map(addStatus2V2)
// Same result

// Approach 3
// Now how to JSDoc-ify an `extends` statement...

/**
 * @callback addStatus2V3
 * @template {addStatus2Args} T - T must have the same props as addStatus2Args
 * @param {T} obj
 * @returns {T} res
 */
const addStatus2V3 = (obj) => {
  let status = 'default case';
  if (obj.active) { status = 'active' }
  if (obj.archived_at) { status = 'dinosaur' }
  if (obj.last_active) { status = 'inactive' }

  return {
    ...obj,
    status,
  }
}

// Now to test...
const transformedData2 = servRes.data.map(addStatus2V3)
// console.log(transformedData2[0].)
// :( It doesn't work
// let me dbl chk with one item

const x2 = addStatus2V3(servRes.data[0])
// that's fine.

// ... maybe `.map` needs its own type to assert what it will return

/**
 * As of 2024 March 4th, it seems using JSDoc to describe generics in function
 * args may not be a great option, at least when functions like `.map` are used
 * since the resulting type is any
 *
 * UPDATE: 2024 March 5th (9:34am)
 * I found a way to do it!
 *
 */
