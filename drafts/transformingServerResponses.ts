/**
 * Lessons:
 * - make your types just what they need to be. you can pass entire objects w/o typing them out
 * - making data transformation functions that rely on only a few params (and thus needed generics)
 * - omitting function return signatures
 * - representing valid states with unions of interfaces
 *
 * This file is to explore these concepts.
 */


/**
 * Scenario:
 * - I was getting data from a server
 * - I had to render that data in a table
 * - Some of the columns didn't match up with the properties in the data
 *   (example: the table had a column for status, but that wasn't a field)
 * - I don't want to call the same data transformation function for every row
 *   rendered.
 * - I don't want to call React.memo X times for X rows because that'll probably
 *   hurt performance more than it would help. (would need to measure) Plus,
 *   that just feels like a code smell.
 *
 * Let's Frolickly Go!
 */

// An object with multiple properties
// Bonus: Show how we can turn this into a union of valid types
interface NdaCompliantObject {
  active: boolean;
  created_at: string;
  isPublic: boolean;
  name: string;
  type: string;
  archived_at?: string;
  last_active?: string;
}

interface ServerResponse {
  data: NdaCompliantObject[];
}

const serverRes: ServerResponse = {
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

// Let's say we need these objects to have a `status` field that's derived from
// some other fields.
// Let's show one way, using what seems like a simple way
// We're using the type that we know the object is in. We know we're going to
// pass it in anyways
const addStatusV1 = (obj: NdaCompliantObject) => {
  let status = 'default case';
  if (obj.active) { status = 'active' }
  if (obj.archived_at) { status = 'dinosaur' }
  if (obj.last_active) { status = 'inactive' }

  return {
    ...obj,
    status,
  }
}

// Think about testing this. If you use the `NdaCompliantObject` type as your
// arg, you'll need to make multiple objects with all of the required fields.
// Let's focus on only the required fields.
function testAddStatusV1() {
  const exObj = {
    active: true,
    // Normally, would omit the undefined params, but they're in to be explicit
    archived_at: undefined,
    last_active: undefined,
  };
  const expected = 'active';
  const result = addStatusV1(exObj);
  console.log(result.status === expected)
}

// Check it out! A type error! The error is saying we're missing some fields
// that NdaCompliantObject has but we don't need those fields in our function


// Now let's try a different approach:
// We'll make a type representing the function's args

// Our arguments type
interface AddStatusArgs {
  active: NdaCompliantObject['active'];
  archived_at?: NdaCompliantObject['archived_at'];
  last_active?: NdaCompliantObject['last_active'];
}

// Same function - the main diff is the arg type
const addStatusV2 = (obj: AddStatusArgs) => {
  let status = 'default case';
  if (obj.active) { status = 'active' }
  if (obj.archived_at) { status = 'dinosaur' }
  if (obj.last_active) { status = 'inactive' }

  return {
    ...obj,
    status,
  }
}

// Let's try our test out
function testAddStatusV2() {
  const exObj = {
    active: true,
    archived_at: undefined,
    last_active: undefined,
  };
  const expected = 'active';
  const result = addStatusV2(exObj);
  console.log(result.status === expected)
}

// Great! The test is fine with a smaller object
// Now let's see this function used in context

const dataWithStatus = serverRes.data.map(addStatusV2)

// Seems like no problem right?
// Look at the type of `dataWithStatus` though with your editor's hover functionality
// Only the fields within the `addStatus` function is listed in the return type!
// We're not filtering out the other properties

// Now the problem becomes: How can we craft a function with an argument type
// that is only concerned with certain fields and not remove the other fields.

// Enter _Generics!_
// We can use generics to say "the functions' argument should be an object with
// this set of properties _at least_"

const addStatusV3 = <T extends AddStatusArgs>(obj: T) => {
  let status = 'default case';
  if (obj.active) { status = 'active' }
  if (obj.archived_at) { status = 'dinosaur' }
  if (obj.last_active) { status = 'inactive' }

  return {
    ...obj,
    status,
  }
}

// No problems in our test...
function testAddStatusV3() {
  const data = {
    active: true,
    archived_at: undefined,
    last_active: undefined,
  }
  const expected = 'active'
  const result = addStatusV3(data)
  console.log(result.status === expected)
}

// ...and no problems with the return type!
const transformedData = serverRes.data.map(addStatusV3)

// We can test the return type by using our editor's autocompletion functionality
// Try it in this console.log statement, just after the period
console.log(transformedData[0].)

const x = addStatusV3(serverRes.data[0])
