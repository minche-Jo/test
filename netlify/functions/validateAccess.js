exports.handler = async (event, context) => {
  // 허용된 IP 주소 목록
  const allowedIPs = ['123.456.789.000', '111.222.333.444']; // 여기에 허용할 IP 주소를 추가하세요

  // 클라이언트의 IP 주소 가져오기
  const clientIP = event.headers['client-ip'] || event.headers['x-forwarded-for'] || event.headers['remote-addr'];

  if (!clientIP || !allowedIPs.includes(clientIP)) {
      return {
          statusCode: 403,
          body: 'Access Denied: Your IP address is not allowed.',
      };
  }

  // IP 주소가 허용된 경우, admin.html 페이지로 리디렉션
  return {
      statusCode: 302,
      headers: {
          Location: '/admin.html',
      },
      body: '',
  };
};
