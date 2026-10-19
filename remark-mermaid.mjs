// remark 插件：在 shiki 高亮之前，把 ```mermaid 围栏转成 <div class="mermaid">，
// 交给客户端 mermaid 库渲染。避免 shiki 把 mermaid 源码逐 token 高亮，破坏后续解析。
export default function remarkMermaid() {
  return (tree) => {
    walk(tree);
  };
}

function walk(node) {
  if (!node || !Array.isArray(node.children)) return;
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child.type === 'code' && String(child.lang || '').toLowerCase() === 'mermaid') {
      node.children[i] = {
        type: 'html',
        value: '<div class="mermaid">' + escapeHtml(child.value) + '</div>',
      };
    } else {
      walk(child);
    }
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}