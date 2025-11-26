import { hash } from 'argon2';

export const handler = async (event) => {
  try {
    const randomString = Math.random().toString(36).substring(2, 15);
    const hashResult = await hash(randomString, {
      type: 2, // Argon2id
      memoryCost: 65536, // 64MB
      timeCost: 3,       // 3 iterations
      parallelism: 4     // 4 lanes
    });

    // Return the result
    // return {
    //   statusCode: 200,
    //   body: `${randomString} => ${hashResult}`,
    // };
    return `${randomString} => ${hashResult}`;
  } catch (error) {
    console.error('Error computing hash:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error computing hash',
        error: error.message
      })
    };
  }
};

