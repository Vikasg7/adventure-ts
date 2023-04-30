type Maybe<T> = T | undefined 

interface Node<T> {
   value:  T,
   left?:  Node<T>,
   right?: Node<T>
}

type NodeValue<T> = T

type Grid<T> = Array<Array<T>>
type Row<T>  = Array<T> 

type Depth = number

function create_node<T>(value:T): Node<T> {
   return { value }
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

function to_grid<T>(root: Node<T>): Grid<NodeValue<T>> {
   const grid = [[root]]
   let depth = 0
   while (true) {
      const row = []
      for (const node of grid[depth]) {
         if (node.left)  row.push(node.left);
         if (node.right) row.push(node.right);
      }
      if (row.length == 0) break;
      grid.push(row)
      depth++
   }
   
   for (const row of grid) {
      for (const [i, r] of row.entries()) {
         (row as Row<NodeValue<T>>)[i] = r.value
      }
   }

   return (grid as Grid<NodeValue<T>>)
}

function print_tree<T>(tree: Node<T>) {
   console.log(JSON.stringify(tree, null, 2))
}

function insert_rec<T>(value: T, root?: Node<T>): Node<T> {
   if (root == undefined) return create_node(value);
   if (value < root.value) root.left  = insert_rec(value, root.left); else
   if (value > root.value) root.right = insert_rec(value, root.right);
   return root;
}

function insert_iter<T>(value: T, root?: Node<T>): Node<T> {
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

function main() {
   const values = [ 15, 79, 90, 10, 55, 12, 20, 50]
   const root = create_node(45);
   const tree = values.reduce((acc, v) => insert_iter(v, acc), root)
   console.log(to_grid(tree))
   console.log("Depth is ", depth(tree))
   print_tree(tree)
}

main()