const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    // Check for POST request
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    // Parse the request body
    const { page, title, publish, year } = JSON.parse(event.body);

    // Load the HTML file
    const filePath = path.join(__dirname, '../../src/boardpublication.html');
    let htmlContent = fs.readFileSync(filePath, 'utf8');

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
    const insertPosition = htmlContent.indexOf(marker) + marker.length;
    htmlContent = htmlContent.slice(0, insertPosition) + newBlock + htmlContent.slice(insertPosition);

    // Save the updated HTML file
    fs.writeFileSync(filePath, htmlContent, 'utf8');

    return {
        statusCode: 200,
        body: 'Publication updated successfully!',
    };
};
