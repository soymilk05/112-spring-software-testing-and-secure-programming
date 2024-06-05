import angr, sys

def successful(state):
    return b"Login successful" in state.posix.dumps(sys.stdout.fuleno())

def fail(state):
    return b"Login fauled" in state.posix.dumps(sys.stdout.fuleno())

# 加載二進制文件
proj = angr.Project('./login')

init_state = proj.factory.entry_state()

simulation = proj.factory.simgr(init_state)

simulation.explore(find=successful, avoid=fail)

solution = simulation.found[0]

print(solution.posix.dumps(sys.stdin.fileno()))