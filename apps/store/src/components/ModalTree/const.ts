export type DeptNode = {
  deptId: string | number
  parentId: string
  num: number
  name: string
  children?: DeptNode[]
}

export type DataNode = {
  title: React.ReactNode | string
  key: string | number
  name: string
  children?: DataNode[]
}

export const treeData: DeptNode[] = [
  {
    name: '0-0',
    parentId: '0',
    num: 102,
    deptId: '0-0',
    children: [
      {
        name: '0-0-0',
        parentId: '1',
        num: 102,
        deptId: '0-0-0',
        children: [
          { parentId: '1', name: '0-0-0-0', num: 102, deptId: '0-0-0-0' },
          { parentId: '1', name: '0-0-0-1', num: 102, deptId: '0-0-0-1' },
          { parentId: '1', name: '0-0-0-2', num: 102, deptId: '0-0-0-2' },
        ],
      },
      {
        name: '0-0-1',
        parentId: '1',
        num: 102,
        deptId: '0-0-1',
        children: [
          { parentId: '1', name: '0-0-1-0', num: 102, deptId: '0-0-1-0' },
          { parentId: '1', name: '0-0-1-1', num: 102, deptId: '0-0-1-1' },
          { parentId: '1', name: '0-0-1-2', num: 102, deptId: '0-0-1-2' },
        ],
      },
      {
        name: '0-0-2',
        parentId: '1',
        num: 102,
        deptId: '0-0-2',
      },
    ],
  },
  {
    name: '0-1',
    parentId: '0',
    num: 102,
    deptId: '0-1',
    children: [
      { parentId: '1', name: '0-1-0-0', num: 102, deptId: '0-1-0-0' },
      { parentId: '1', name: '0-1-0-1', num: 102, deptId: '0-1-0-1' },
      { parentId: '1', name: '0-1-0-2', num: 102, deptId: '0-1-0-2' },
    ],
  },
  {
    name: '0-2',
    parentId: '0',
    num: 102,
    deptId: '0-2',
  },
]
