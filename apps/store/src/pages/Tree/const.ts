export type DataNode = {
  deptId: string | number
  parentId: string
  name?: React.ReactNode | ((data: DataNode) => React.ReactNode)
  children?: DataNode[]
}

export const treeData: DataNode[] = [
  {
    name: '0-0',
    parentId: '0',
    deptId: '0-0',
    children: [
      {
        name: '0-0-0',
        parentId: '1',
        deptId: '0-0-0',
        children: [
          { parentId: '1', name: '0-0-0-0', deptId: '0-0-0-0' },
          { parentId: '1', name: '0-0-0-1', deptId: '0-0-0-1' },
          { parentId: '1', name: '0-0-0-2', deptId: '0-0-0-2' },
        ],
      },
      {
        name: '0-0-1',
        parentId: '1',
        deptId: '0-0-1',
        children: [
          { parentId: '1', name: '0-0-1-0', deptId: '0-0-1-0' },
          { parentId: '1', name: '0-0-1-1', deptId: '0-0-1-1' },
          { parentId: '1', name: '0-0-1-2', deptId: '0-0-1-2' },
        ],
      },
      {
        name: '0-0-2',
        parentId: '1',
        deptId: '0-0-2',
      },
    ],
  },
  {
    name: '0-1',
    parentId: '0',
    deptId: '0-1',
    children: [
      { parentId: '1', name: '0-1-0-0', deptId: '0-1-0-0' },
      { parentId: '1', name: '0-1-0-1', deptId: '0-1-0-1' },
      { parentId: '1', name: '0-1-0-2', deptId: '0-1-0-2' },
    ],
  },
  {
    name: '0-2',
    parentId: '0',
    deptId: '0-2',
  },
]
