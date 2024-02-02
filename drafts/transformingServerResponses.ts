// search for WHERE YOU LEFT OFF:


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

// An ideal table interface. With data like this, no inline transformation
// functions nor column objects with weird accessors/ids/rendering/etc.
// would be necessary
interface TableData {
  name: string;
  created: string;
  status: string;
  type: string;
}

const renderTable = (data: TableData) => {
  // use your xXImaginationXx to pretend we're rendering react components here
  return data;
}


// And now for our function for deriving 'status'
// Let's show one way, using what seems like a simple way
// We're using the type that we know the object is in. We know we're going to
// pass it in anyways
const addStatus = (obj: NdaCompliantObject) => {
  let status = 'default case';
  if (obj.active) { status = 'active' }
  if (obj.archived_at) { status = 'dinosaur' }
  if (obj.last_active) { status = 'inactive' }

  return {
    ...obj,
    status,
  }
}

const test1 = serverRes.data.map(addStatus)
/**
 * WHERE YOU LEFT OFF:
 */

// Think about testing this. If you use the `NdaCompliantObject` type as your
// arg, you'll need to make multiple objects with all of the required fields.
// Let's focus on only the required fields.
const getStatus = ({
  active,
  archived_at,
  last_active,
}: {
  active: NdaCompliantObject['active'],
  archived_at?: NdaCompliantObject['archived_at'],
  last_active?: NdaCompliantObject['last_active'],
}) => {
  if (active) { return 'active' }
  if (archived_at) { return 'dinosaur' }
  if (last_active) { return 'inactive' }
  return 'idk how we got here'
}

// Cool, let's use a map to see what we get
const test2 = serverRes.data.map(obj => ({ ...obj, status: getStatus(obj) }))

// For gits and shiggles, let's say we're only concerned with adding the status
// field. We're fine with keeping the other values in there too. No removals.




// Here's another example with pokemon and using data from another place to
// augment data returned from a server
// What does our data look like?
type UnixTimestamp = number; // example: 1706763351474 -> 2024/Jan/31

interface PokemonData {
  name: string;
  captured: UnixTimestamp;
  generation: number;
  type: string;
  isShiny: boolean;
}

interface ApiResponse {
  data: PokemonData[];
  timestamp: UnixTimestamp;
}

const res: ApiResponse = {
  data: [
    {
      name: 'Pikachu',
      captured: 1706763351474,
      generation: 1,
      type: 'electric',
      isShiny: false,
    },
    {
      name: 'Espeon',
      captured: 1706743271473,
      generation: 2,
      type: 'psychic',
      isShiny: false,
    },
    {
      name: 'BIDOOF',
      captured: 1706733300666,
      generation: 4,
      type: 'normal',
      isShiny: true,
    },
  ],
  timestamp: 1706763351474,
}


// Cool, so we want to transform our data by turning the unix timestamps into
// human readable datetime strings. (Aren't words fun?)
// We only care about the timestamp field so let's start with that.
const unixTimeToHumanTime = (timestamp: UnixTimestamp) => {
  const d = new Date(timestamp)
  return d.toLocaleString()
}

// Now we just have to apply that to all of our data
// The straight forward way
const formattedData = res.data.map(p => ({
  ...p,
  captured: unixTimeToHumanTime(p.captured)
}))

// But what if multiple transformations are being applied?
// What if you're in a scenario where you can't just use `map` simply and don't
// have time to refactor?
const formatPokemonCaptured = (p: PokemonData) => {
  
}
