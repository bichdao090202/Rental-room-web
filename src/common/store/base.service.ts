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

  console.log(response);
  

  if (!response.ok) {
    throw Error('Server error!');
  }

  return await response.json();
};

export const post = async (
  url: string,
  data?: any,
  domain: boolean = true,
): Promise<any> => {
    const response = await fetch(
      domain ?  `${process.env.NEXT_PUBLIC_API_URL}/${url}` : `${url}` ,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      },
    );

    const res = await response.json();
    return res;
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
    return await response.json(); 
  } catch (parseError) {
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

  console.log(`process.env.NEXT_PUBLIC_API_URL}/${url}`);

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
  
};

export const signPost = async (
  url: string,
  data?: any,
): Promise<any> => {
  console.log(`${process.env.NEXT_PUBLIC_API_URL_SIGN_GATEWAY}/${url}`);
  
    const response = await fetch(
      `${process.env.SIGN_GATEWAY}/${url}` ,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      },
    );

    const res = await response.json();
    return res;
};