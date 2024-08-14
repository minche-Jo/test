exports.handler = async (event) => {
  const fetch = (await import('node-fetch')).default;

  if (event.httpMethod !== 'POST') {
      return {
          statusCode: 405,
          body: 'Method Not Allowed',
      };
  }

  // 여기에서 허용할 ID와 비밀번호를 설정합니다.
  const validId = 'your-username';
  const validPassword = 'your-password';

  // 요청 본문에서 ID와 비밀번호를 가져옵니다.
  const { id, password, page, title, publish, year } = JSON.parse(event.body);

  // ID와 비밀번호가 올바른지 확인합니다.
  if (id !== validId || password !== validPassword) {
      return {
          statusCode: 401,
          body: 'Unauthorized: Invalid ID or Password',
      };
  }

  // GitHub API 관련 설정
  const owner = 'minche-Jo';  // GitHub 사용자 이름
  const repo = 'test';  // 리포지토리 이름
  const path = 'src/boardpublication.html';  // 파일 경로
  const branch = 'master';  // 브랜치 이름
  const token = process.env.GITHUB_TOKEN;  // Netlify 환경 변수에서 토큰 가져오기

  try {
      // 현재 파일의 내용을 가져오기 위해 GitHub API 호출
      const fileResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
          headers: {
              'Authorization': `token ${token}`,
              'Accept': 'application/vnd.github.v3+json',
          },
      });

      if (!fileResponse.ok) {
          const errorData = await fileResponse.json();
          return {
              statusCode: fileResponse.status,
              body: `Failed to fetch file: ${errorData.message}`,
          };
      }

      const fileData = await fileResponse.json();
      const content = Buffer.from(fileData.content, 'base64').toString('utf8');

      // 새 HTML 블록 생성
      const newBlock = `
<tr class="page page${page}">
  <td>
      <table>
          <tr valign="top">
              <td width="30" align="center">${page}.</td>
              <td class="publicationTitle">
                  <p>${title}</p>
                  <p>${publish} <b>(<span class="year">${year}</span>).</b></p>
              </td>
              <td width="10"></td>
          </tr>
      </table>
  </td>
</tr>`;

      // 새로운 블록을 <!--list 시작--> 주석 뒤에 삽입
      const marker = '<!--list 시작-->';
      const insertPosition = content.indexOf(marker) + marker.length;
      const newContent = content.slice(0, insertPosition) + newBlock + content.slice(insertPosition);

      // 새로운 내용을 base64로 인코딩
      const encodedContent = Buffer.from(newContent, 'utf8').toString('base64');

      // 파일을 업데이트하기 위해 GitHub API 호출
      const updateResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
          method: 'PUT',
          headers: {
              'Authorization': `token ${token}`,
              'Accept': 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              message: `Update ${path} with new publication`,
              content: encodedContent,
              sha: fileData.sha,
              branch: branch,
          }),
      });

      const updateResponseBody = await updateResponse.json();

      if (updateResponse.ok) {
          return {
              statusCode: 200,
              body: 'Publication updated successfully!',
          };
      } else {
          return {
              statusCode: 500,
              body: `Failed to update publication: ${updateResponseBody.message}`,
          };
      }
  } catch (error) {
      return {
          statusCode: 500,
          body: `An error occurred: ${error.message}`,
      };
  }
};
