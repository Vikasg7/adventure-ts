type NodeValue<T> = T

interface Node<T> {
   value:  NodeValue<T>,
   left?:  Node<T>,
   right?: Node<T>
}

type Side = "left" | "right"

type Root<T> = Node<T>
type Row<T>  = Array<T>
type Grid<T> = Array<Row<T>>
type Depth   = number

type Maybe<T> = T | undefined

function create_node<T>(value:T): Node<T> {
   return { value, left: undefined, right: undefined }
}

function depth<T>(root: Node<T>): Depth {
   const grid = [[root]]
   let depth = 1
   while (true) {
      const row = []
      for (const node of grid[0]) {
         if (node.left)  row.push(node.left);
         if (node.right) row.push(node.right);
      }
      if (row.length == 0) break;
      grid[0] = row
      depth++
   }
   return depth
}

function to_grid<T>(root: Node<T>): Grid<Maybe<NodeValue<T>>> {
   const grid: Grid<Maybe<Node<T>>> = [[root]]
   
   let depth = 0
   while (true) {
      const row = []
      let empty = true
      for (const node of grid[depth]) {
         if (node == undefined) {
            row.push(undefined)
            row.push(undefined)
            continue
         }
         row.push(node.left);
         row.push(node.right);
         if (node.left || node.right) empty = false;
      }
      if (empty) break;
      grid.push(row)
      depth++
   }
   
   for (const row of grid) {
      for (const [i, node] of row.entries()) {
         if (node == undefined) continue;
         (row as Row<Maybe<NodeValue<T>>>)[i] = node.value
      }
   }

   return (grid as Grid<Maybe<NodeValue<T>>>)
}

function to_string<T>(nv?: NodeValue<T>): string {
   if (nv == undefined) return "__";
   return nv.toString()
}

function print_tree<T>(tree?: Node<T>): void {
   if (tree == undefined) 
      return console.log("Oops! Tree is empty.");
   const grid  = to_grid(tree)
   const depth = grid.length
   const width = 2 ** depth
   for (const [r, row] of grid.entries()) {
      const fstIdx = 2 ** (depth - r - 1)
      const offset = 2 ** (depth - r)
      const eleCnt = 2 ** r
      const line = new Array(width)
      line.fill("  ")
      for (let i = 0; i < eleCnt; i++)
         line[fstIdx + (offset * i)] = to_string(row[i]);
      console.log(line.join(""), "\n")
   }
}

function insert_tail_rec<T>(value: T, root?: Root<T>, curr?: Node<T>, side?: Side): Root<T> {
   if (root == undefined) return create_node(value)
   if (curr == undefined) curr = root
   if (side == undefined) {
      if (value < curr.value) return insert_tail_rec(value, root, curr, "left"); 
      if (value > curr.value) return insert_tail_rec(value, root, curr, "right");
      return root
   }
   const next = curr[side]
   if (next == undefined) {
      curr[side] = create_node(value)
      return root
   }
   if (value < next.value) return insert_tail_rec(value, root, next, "left"); 
   if (value > next.value) return insert_tail_rec(value, root, next, "right");
   return root
}

function insert_rec<T>(value: T, root?: Root<T>): Root<T> {
   if (root == undefined) return create_node(value);
   if (value < root.value) root.left  = insert_rec(value, root.left); else
   if (value > root.value) root.right = insert_rec(value, root.right);
   return root;
}

function insert_iter<T>(value: T, root?: Root<T>): Root<T> {
   if (root == undefined) return create_node(value);

   let prev: Maybe<Node<T>> = undefined,
       curr: Maybe<Node<T>> = root
   do {
      prev = curr
      if (value < prev.value) curr = prev.left;  else
      if (value > prev.value) curr = prev.right; else
      break;
   } while (curr != undefined)

   if (value < prev.value) prev.left  = create_node(value); else
   if (value > prev.value) prev.right = create_node(value);
   return root;
}

function binary_search<T>(value: NodeValue<T>, root: Root<T>): Maybe<Node<T>> {
   let curr: Maybe<Node<T>> = root
   do {
      if (value < curr.value) curr = curr.left;  else
      if (value > curr.value) curr = curr.right; else
      return curr;
   } while (curr != undefined)
   return undefined;
}

function main() {
   const values = [45, 15, 79, 90, 10, 55, 12, 20, 50, 46, 18]
   const root = undefined as Maybe<Root<number>>
   const tree = values.reduce((acc, v) => insert_iter(v, acc), root) as Root<number>
   print_tree(tree)
   const needle = 46
   const found = binary_search(needle, tree)
   console.log("Searching for key: ", needle)
   console.log("       Node found: ", found)
}

if (import.meta.main)
   main();