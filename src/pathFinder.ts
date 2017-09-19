class PathFinder{

    pathRegistrations:PathRegistration[] = []

    constructor(){

    }

    trigger(path:string){
        var fragments = path.split("/")
        

        outerloop:
        for(var pathRegistration of this.pathRegistrations){
            if(pathRegistration.pathFragments.length != fragments.length){
                continue
            }

            var hitVariables: string[] = []
            for(var i = 0; i < pathRegistration.pathFragments.length; i++){
                var registeredFragment = pathRegistration.pathFragments[i]
                if(registeredFragment[0] == ":"){
                    hitVariables.push(fragments[i])
                }else if(registeredFragment != fragments[i]){
                    continue outerloop
                } else{
                    //just continue
                }
            }
            pathRegistration.callback(hitVariables)
            break
        }
    }

    register(path:string,callback:(stringParameters:string[]) => void){
        this.pathRegistrations.push(new PathRegistration(path.split("/"),callback))
    }
}

class PathRegistration{
    callback: (stringParameters: string[]) => void
    pathFragments:string[]

    constructor(path: string[], callback: (stringParameters: string[]) => void){
        this.pathFragments = path
        this.callback = callback
    }
}