interface BaseOpts {
  auth?: boolean;
  onRouteHandler?: boolean;
  authType?: 'device' | 'server';
  deviceToken?: string;
  cache?: RequestCache;
}

export const get = async (url: string, opts?: BaseOpts): Promise<any> => {
  const defaultOpts = { auth: true, cache: 'default' as RequestCache };
  if (opts) {
    opts = { ...defaultOpts, ...opts };
  }
  const response = await fetch(
    `${opts?.onRouteHandler ? '' : process.env.NEXT_PUBLIC_API_URL}/${url}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: opts?.cache,
    },
  );

  if (!response.ok) {
    throw Error('Server error!');
  }

  return await response.json();
};

export const post = async (
  url: string,
  data?: any,
  opts?: any,
): Promise<any> => {
  const defaultOpts = { auth: true, cache: 'default' };
  if (opts) {
    opts = { ...defaultOpts, ...opts };
  }

  const response = await fetch(
    `${opts?.onRouteHandler ? '' : process.env.NEXT_PUBLIC_API_URL}/${url}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
      cache: opts?.cache,
    },
  );

  const res = await response.json();
  return res;
//const response = await axios.get(`http://ec2-13-236-165-0.ap-southeast-2.compute.amazonaws.com:3006/api/v1/booking-requests`);
  // if (!response.ok) {
  //   throw Error('Server error!');
  // }

  // try {
  //   return await response.json();
  // } catch (parseError) {
  //   return {};
  // }
};

export const remove = async (
  url: string,
  data?: any,
  opts?: any,
): Promise<any> => {
  const defaultOpts = { auth: true, cache: 'default' };
  if (opts) {
    opts = { ...defaultOpts, ...opts };
  }
  const response = await fetch(
    `${opts?.onRouteHandler ? '' : process.env.NEXT_PUBLIC_API_URL}/${url}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
      cache: opts?.cache,
    },
  );

  if (!response.ok) {
    throw Error('Server error!');
  }

  try {
    return await response.json(); // Try to parse as JSON if content exists
  } catch (parseError) {
    // If parsing fails (not valid JSON), handle gracefully
    console.error('JSON Parsing Error:', parseError);
    throw new Error('Invalid JSON response from the server');
  }
};

export const put = async (
  url: string,
  data?: any,
  opts?: any,
): Promise<any> => {
  const defaultOpts = { auth: true, cache: 'default' };
  if (opts) {
    opts = { ...defaultOpts, ...opts };
  }

  const response = await fetch(
    `${opts?.onRouteHandler ? '' : process.env.NEXT_PUBLIC_API_URL}/${url}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },     
      body: data ? JSON.stringify(data) : undefined,
      cache: opts?.cache,
    },
  );
  const res = await response.json();
  return res;

  // if (!response.ok) {
  //   throw Error('Server error!');
  // }

  // try {
  //   return await response.json();
  // } catch (parseError) {
  //   // Handle parsing error gracefully if response is not in JSON format
  //   console.error('JSON Parsing Error:', parseError);
  //   throw new Error('Invalid JSON response from the server');
  // }
};
