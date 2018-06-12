import cx_Freeze

executables = [cx_Freeze.Executable("Snake.py")]

cx_Freeze.setup(
    name="Snake I",
    options={"build_exe":{"packages":["pygame"],"include_files":["Assets/apple.png","Assets/snakehead.png","Assets/appleImg.png"]}},
    description = "Snake version I",
    executables = executables
    )
