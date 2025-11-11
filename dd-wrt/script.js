// This script is entirely AI generated for time reasons.

marked.setOptions({
  breaks: true,  // <-- key setting
});

async function loadMarkdown(file) {
  try {
    const response = await fetch(file);
    const text = await response.text();
    document.getElementById('content').innerHTML = marked.parse(text);
  } catch (err) {
    document.getElementById('content').innerHTML = "<p>Error loading file.</p>";
  }
}


const file = "dd-wrt.md"; 
loadMarkdown(file);

//////////////


// Run this AFTER you set container.innerHTML = marked.parse(markdownText)
function convertObsidianEmbeds(container) {
  if (!container) return;

  // HTML-escape helper
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Convert image embeds: ![[path/to/file.png]] or ![[file.png|Alt text]]
  const imgRegex = /!\[\[([^\]\|]+?)(?:\|([^\]]+?))?\]\]/g;

  // Convert wiki-links: [[note.md]] or [[note.md|Label]]
  const linkRegex = /\[\[([^\]\|]+?)(?:\|([^\]]+?))?\]\]/g;

  // Work on the raw HTML string so we don't accidentally break DOM nodes while iterating
  let html = container.innerHTML;

  // Replace image embeds
  html = html.replace(imgRegex, (match, path, alt) => {
    path = path.trim();
    // adjust base path if your images live somewhere else (e.g., "images/")
    // If path already contains a folder, keep it. Otherwise prepend if desired.
    const src = encodeURI(path); // URL-encode spaces and special chars
    const altText = alt ? alt.trim() : path.split('/').pop();
    return `<img src="${src}" alt="${escapeHtml(altText)}" class="md-image" loading="lazy">`;
  });

  // Replace wiki-links with anchors (optional — comment out if you don't want this)
  html = html.replace(linkRegex, (match, target, label) => {
    target = target.trim();
    const display = (label && label.trim()) || target;
    // If target looks like an .md file, link to the viewer with ?file=... (adjust as needed)
    const href = target.endsWith('.md') ? `?file=${encodeURIComponent(target)}` : encodeURI(target);
    return `<a href="${href}">${escapeHtml(display)}</a>`;
  });

  container.innerHTML = html;
}

// Example usage inside your markdown loader:
async function loadMarkdown(file) {
  const contentEl = document.getElementById('content');
  try {
    const res = await fetch(file);
    const text = await res.text();
    contentEl.innerHTML = marked.parse(text);

    // Now convert Obsidian-style embeds to <img> (and wiki-links)
    convertObsidianEmbeds(contentEl);

    // Optional: if you use syntax highlighting, call highlight.js here
    // document.querySelectorAll('pre code').forEach(block => hljs.highlightBlock(block));
  } catch (err) {
    contentEl.innerHTML = "<p>Error loading file.</p>";
    console.error(err);
  }
}
