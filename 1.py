import time
lis=['[=         ]','[==        ]','[===       ]','[ ===      ]','[  ===     ]','[   ===    ]','[    ===   ]','[     ===  ]','[      === ]','[       ===]','[        ==]','[         =]']#,'[        ==]','[       ===]','[      === ]','[     ===  ]','[    ===   ]','[   ===    ]','[  ===     ]','[ ===      ]','[===       ]','[==        ]','[=         ]']
while True:
    for i in lis:
        print(i,end='\r')
        time.sleep(0.1)