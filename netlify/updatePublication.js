const fetch = require('node-fetch');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    // Parse the request body
    const { page, title, publish, year } = JSON.parse(event.body);

    // GitHub API parameters
    const owner = 'minche-Jo';  // GitHub 사용자 이름
    const repo = 'test';  // 리포지토리 이름
    const path = 'src/boardpublication.html';  // 파일 경로
    const branch = 'master';  // 브랜치 이름
    const token = process.env.GITHUB_TOKEN;  // Netlify 환경 변수로부터 토큰 불러오기

    // Get the current content of the file
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

    // Generate the new HTML block to insert
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

    // Insert the new block right after <!--list 시작-->
    const marker = '<!--list 시작-->';
    const insertPosition = content.indexOf(marker) + marker.length;
    const newContent = content.slice(0, insertPosition) + newBlock + content.slice(insertPosition);

    // Encode the new content in base64
    const encodedContent = Buffer.from(newContent, 'utf8').toString('base64');

    // Update the file on GitHub
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

    const updateResponseBody = await updateResponse.json();  // 중복된 json 호출 제거

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
};
