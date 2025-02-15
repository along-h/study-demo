/** 判断是否是数字类型 */
const isNumber = (char) => {
  if (char === " " || char === "") return false;
  return /[0-9]/.test(+char);
};
/** 判断是否是字母类型 */
const isLetter = (char) => {
  if (char === " " || char === "") return false;
  return /[a-zA-Z]/.test(char);
};

// 步骤1：词法分析器
// 词法分析器 生成token数组
// 针对下列代码做简单词法分析
// (add 2 (subtract 4 2))
const tokenizer = (input) => {
  const tokens = [];
  // 不是字符串直接return
  if (typeof input !== "string") {
    return tokens;
  }
  // 遍历输入的内容，转化token
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    switch (true) {
      case ["(", ")"].includes(char):
        tokens.push({ type: "paren", value: char });
        break;
      case isNumber(char):
        // 是数字的话判断下一个字符是否是数字类型
        // 将其作为整体
        let fullName = char;
        let nextChar = input[++i];
        if (!isNumber(nextChar)) {
          i--;
        }
        while (isNumber(nextChar)) {
          fullName += nextChar;
          nextChar = input[++i];
        }
        tokens.push({ type: "number", value: fullName });
        break;
      default:
        // 进来的可能是空字符串
        if (char !== " ") {
          // 字母类型
          // 同数字判断截取完整的字母类型
          let funllStr = char;
          let nextStr = input[++i];
          if (!isLetter(nextStr)) {
            i--;
          }
          while (isLetter(nextStr)) {
            funllStr += nextStr;
            nextStr = input[++i];
          }
          tokens.push({ type: "name", value: funllStr });
        }
        break;
    }
  }
  return tokens;
};

// 步骤2：语法分析
// 语法分析过程
// 生成AST树
// (add 2 (subtract 4 2))
const parser = (tokens) => {
  const ast = { type: "Program", body: [] };
  let current = 0;

  // 操作器
  const handler = () => {
    let item = tokens[current];
    current++;
    if (!item) return null;
    switch (true) {
      case item.type === "number":
        return {
          type: "NumberLiteral",
          value: item.value,
        };
      case item.type === "paren" && item.value === "(":
        item = tokens[current];
        const astNode = {
          type: "CallExpression",
          name: item.value, // 名字是下一项
          params: [],
        };
        // 下一项不是paren，说明是参数
        // 下一项是paren并且是），说明结束
        item = tokens[++current];
        while (
          item.type !== "paren" ||
          (item.type === "paren" && item.value !== ")")
        ) {
          const subItem = handler();
          if (subItem) {
            astNode.params.push(subItem);
            item = tokens[current];
          }
        }
        current++;
        return astNode;
      default:
        return null;
    }
  };

  // 循环处理token
  while (current < tokens.length) {
    const astNode = handler();
    if (astNode) {
      ast.body.push(astNode);
    }
  }
  return ast;
};

/**
 * 遍历AST树
 * @param {Object} ast 语法树
 * @param {Object} visitor 各类节点的处理器
 */
const traverser = (ast, visitor) => {
  const traverserNode = (node, parent) => {
    // Program时没有enter
    const enter = visitor[node.type]?.enter;
    if (enter) {
      enter(node, parent);
    }
    switch (node.type) {
      case "Program":
        // 遍历body
        node.body.forEach((child) => {
          traverserNode(child, node);
        });
        break;
      case "CallExpression":
        // 遍历params
        node.params.forEach((child) => {
          traverserNode(child, node);
        });
        break;
      default:
        break;
    }
  };
  traverserNode(ast, null);
};
// 步骤3：AST转换
// 转换成目标语言AST
const transformer = (ast) => {
  const newAst = { type: "Program", body: [] };
  // 记录上下文
  // 通过上下文往newAst的body中传递
  ast._content = newAst.body;
  traverser(ast, {
    NumberLiteral: {
      enter(node, parent) {
        parent._content.push({
          type: "NumberLiteral",
          value: node.value,
        });
      },
    },
    CallExpression: {
      enter(node, parent) {
        let expression = {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: node.name,
          },
          arguments: [],
        };
        node._content = expression.arguments;
        if (parent.type !== "CallExpression") {
          expression = {
            type: "ExpressionStatement",
            expression: expression,
          };
        }
        parent._content.push(expression);
      },
    },
  });
  return newAst;
};

// 步骤4：代码生成
// 生成目标代码
// 目标代码可以是JS，也可以是其他语言
// 这里只生成JS代码
const codeGenerator = (newAst) => {
  switch (newAst.type) {
    case "Program":
      return newAst.body.map(codeGenerator).join("\n");
    case "ExpressionStatement":
      return codeGenerator(newAst.expression) + ";";
    case "CallExpression":
      return `${codeGenerator(newAst.callee)}(${newAst.arguments
        .map(codeGenerator)
        .join(", ")})`;
    case "Identifier":
      return newAst.name;
    case "NumberLiteral":
      return newAst.value;
    default:
      return "";
  }
};

// 整个编译器流程
const compiler = (input) => {
  return codeGenerator(transformer(parser(tokenizer(input))));
};
module.exports = { tokenizer, parser, transformer, codeGenerator, compiler };
