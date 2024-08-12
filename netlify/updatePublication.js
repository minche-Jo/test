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
    const owner = 'minche-Jo';
    const repo = 'test';
    const path = 'src/boardpublication.html';
    const branch = 'master'; // or the branch you want to update
    const token = process.env.GITHUB_TOKEN;  // Netlify 환경 변수를 통해 토큰을 불러옴

    // Get the current content of the file
    const fileResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
        },
    });

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

    // Insert the new block after <!--list 시작-->
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

    if (updateResponse.ok) {
        return {
            statusCode: 200,
            body: 'Publication updated successfully!',
        };
    } else {
        const errorData = await updateResponse.json();
        return {
            statusCode: 500,
            body: `Failed to update publication: ${errorData.message}`,
        };
    }
};
